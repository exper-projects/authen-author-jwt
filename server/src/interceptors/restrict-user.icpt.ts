import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface UserResponse {
  data: User;
}

const restrictUserData = (user: UserResponse) => ({
  ...user,
  password: undefined,
  storedRefreshToken: undefined,
  createdAt: undefined,
  updatedAt: undefined,
});

@Injectable()
export class RestrictUserInterceptor
  implements NestInterceptor<User, UserResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<UserResponse> {
    return next.handle().pipe(
      map((data) => {
        return data.length
          ? data.map((user) => restrictUserData(user))
          : restrictUserData(data);
      }),
    );
  }
}
