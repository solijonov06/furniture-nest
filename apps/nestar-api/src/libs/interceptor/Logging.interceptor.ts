import { CallHandler, Injectable, Logger, NestInterceptor,ExecutionContext } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Observable, tap } from "rxjs";



@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private readonly logger: Logger  = new Logger()
    
    intercept(context: ExecutionContext, next: CallHandler) : Observable<any>{
        const recordTime = Date.now();
        const requestType = context.getType<GqlContextType>();
        

        if(requestType === 'http'){
            // For HTTP requests, also return the handler with logging
            return next.handle().pipe(
                tap((context) => {
                    const responseTime = Date.now() - recordTime;
                    this.logger.log(`HTTP Response - ${responseTime}ms`, `RESPONSE`);
                })
            );
        }else if(requestType === 'graphql'){
            /**Print request */
            const gqlContext = GqlExecutionContext.create(context);
            // console.log("gqlContext",gqlContext.getContext().req.body); 
            this.logger.log(`Type, ${this.stringify(gqlContext.getContext().req.body)}`, `Request` )
            /**Error handling via graphql */

            /**NO errors, giving response Below */
        return next.handle().pipe
        (tap((context)=>{
            const responseTime =Date.now() - recordTime;
        this.logger.log(`${this.stringify(context)}-${responseTime}ms \n\n`, `RESPONSE`)
                } 
              )
            )
        }
    }

    private stringify(context: ExecutionContext):string{
        console.log(typeof context)
        return JSON.stringify(context).slice(0,75);

    }
}