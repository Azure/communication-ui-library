// © Microsoft Corporation. All rights reserved.
export type FunctionWithKey<KeyT, ArgsT extends any[], RetT> = (key: KeyT, ...args: ArgsT) => RetT;
export type CallbackType<KeyT, ArgsT extends any[], FnRetT> = (
  memoizedFn: FunctionWithKey<KeyT, ArgsT, FnRetT>
) => FnRetT[];

const argsCmp = (args1: any[], args2: any[], objCmp: (obj1: any, obj2: any) => boolean): boolean => {
  return args1.length === args2.length && args1.every((arg1, index) => objCmp(args2[index], arg1));
};

export const memoizeAll = <KeyT, ArgsT extends any[], FnRetT, CallBackT extends CallbackType<KeyT, ArgsT, FnRetT>>(
  fn: FunctionWithKey<KeyT, ArgsT, FnRetT>,
  compareFunc: (args1: any, args2: any) => boolean = Object.is
): ((callback: CallBackT) => FnRetT[]) => {
  let cache = new Map<KeyT, [ArgsT, FnRetT]>();
  let nextCache = new Map<KeyT, [ArgsT, FnRetT]>();

  return (callback: CallbackType<KeyT, ArgsT, FnRetT>): FnRetT[] => {
    const memoizedFn: FunctionWithKey<KeyT, ArgsT, FnRetT> = (key: KeyT, ...args: ArgsT): FnRetT => {
      const value = cache.get(key);
      if (value) {
        const [preArgs, ret] = value;
        if (argsCmp(preArgs, args, compareFunc)) {
          nextCache.set(key, [args, ret]);
          return ret;
        }
      }
      const ret = fn(key, ...args);
      nextCache.set(key, [args, ret]);
      return ret;
    };
    const retValue = callback(memoizedFn);
    cache = nextCache;
    nextCache = new Map<KeyT, [ArgsT, FnRetT]>();
    return retValue;
  };
};
