import { DynamicModule, Module, ModuleMetadata, Provider } from '@nestjs/common'

@Module({})
export class CoreModule {
  static register(options: CoreModuleOptions): DynamicModule {
    return {
      module: CoreModule,
      providers: [
        {
          provide: 'CORE_MODULE_OPTIONS',
          useValue: options,
        },
      ],
    }
  }

  static registerAsync(options: CoreModuleAsyncOptions): DynamicModule {
    return {
      module: CoreModule,
      imports: options.imports || [],
      providers: [this.createAsyncOptionsProvider(options)],
      exports: [this.createAsyncOptionsProvider(options)],
    }
  }

  private static createAsyncOptionsProvider(options: CoreModuleAsyncOptions): Provider {
    return {
      provide: 'CORE_MODULE_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject || [],
    }
  }
}

export interface CoreModuleOptions {
  grpcApiKey?: string
}

export interface CoreModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<CoreModuleOptions> | CoreModuleOptions
  inject?: any[]
}
