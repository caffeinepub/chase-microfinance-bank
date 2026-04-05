import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface User {
    id: bigint;
    isFrozen: boolean;
    username: string;
    createdAt: Time;
    passwordHash: string;
    isFlagged: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getUserByName(id: string): Promise<User>;
    isCallerAdmin(): Promise<boolean>;
    listUsersById(): Promise<Array<User>>;
    listUsersByName(): Promise<Array<User>>;
    register(username: string, password: string): Promise<string>;
}
