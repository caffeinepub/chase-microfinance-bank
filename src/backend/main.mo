import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Char "mo:core/Char";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type User = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    createdAt : Time.Time;
    isFrozen : Bool;
    isFlagged : Bool;
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      switch (Text.compare(user1.username, user2.username)) {
        case (#equal) { Nat.compare(user1.id, user2.id) };
        case (other) { other };
      };
    };

    public func compareById(user1 : User, user2 : User) : Order.Order {
      Nat.compare(user1.id, user2.id);
    };
  };

  let users = Map.empty<Text, User>();
  var idCounter = 0;

  public query ({ caller }) func listUsersByName() : async [User] {
    users.values().toArray().sort(); // by username
  };

  public query ({ caller }) func listUsersById() : async [User] {
    users.values().toArray().sort(User.compareById);
  };

  public shared ({ caller }) func register(username : Text, password : Text) : async Text {
    if (username == "") { return "Username cannot be empty" };
    if (password.size() < 6) { return "Password must be at least 6 characters" };

    if (username.toIter().any(func(c) { not ((c >= 'a' and c <= 'z') or (c >= '0' and c <= '9')) })) {
      return "Username can only contain lowercase letters and numbers (no spaces or special characters)";
    };

    if (users.containsKey(username)) { return "Username already exists" };

    let newUser : User = {
      id = idCounter;
      username;
      passwordHash = password; // TODO: hash password
      createdAt = Time.now();
      isFrozen = false;
      isFlagged = false;
    };
    users.add(username, newUser);
    idCounter += 1;
    "User ".concat(username).concat(" successfully registered!");
  };

  public query ({ caller }) func getUserByName(id : Text) : async User {
    switch (users.get(id)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) { user };
    };
  };
};
