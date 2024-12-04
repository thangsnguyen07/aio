// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v5.28.3
// source: user.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface PaginationRequest {
  page: number;
  skip: number;
  limit: number;
}

export interface BaseResponse {
  message: string;
  statusCode: number;
  success: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Users {
  users: User[];
}

export interface GetUserRequest {
  username: string;
}

export interface GetUserByIdRequest {
  id: string;
}

export interface UpdateUserRequest {
  id: string;
  password: string;
}

export interface UpdateUserPasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ValidateUserRequest {
  username: string;
  password: string;
}

export interface ValidateUserResponse {
  id: string;
}

export interface UserServiceClient {
  createUser(request: CreateUserRequest, metadata?: Metadata): Observable<User>;

  getUser(request: GetUserRequest, metadata?: Metadata): Observable<User>;

  getUserById(request: GetUserByIdRequest, metadata?: Metadata): Observable<User>;

  updateUserPassword(request: UpdateUserPasswordRequest, metadata?: Metadata): Observable<User>;

  listUsers(request: PaginationRequest, metadata?: Metadata): Observable<Users>;

  validateUser(request: ValidateUserRequest, metadata?: Metadata): Observable<ValidateUserResponse>;
}

export interface UserServiceController {
  createUser(request: CreateUserRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  getUser(request: GetUserRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  getUserById(request: GetUserByIdRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  updateUserPassword(request: UpdateUserPasswordRequest, metadata?: Metadata): Promise<User> | Observable<User> | User;

  listUsers(request: PaginationRequest, metadata?: Metadata): Promise<Users> | Observable<Users> | Users;

  validateUser(
    request: ValidateUserRequest,
    metadata?: Metadata,
  ): Promise<ValidateUserResponse> | Observable<ValidateUserResponse> | ValidateUserResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "getUser",
      "getUserById",
      "updateUserPassword",
      "listUsers",
      "validateUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
