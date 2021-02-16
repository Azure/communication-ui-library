// © Microsoft Corporation. All rights reserved.

export function createSpyObj<T>(baseName: string, methodNames: (keyof T)[]): jest.Mocked<T> {
  const obj: any = {};
  for (const methodName of methodNames) {
    obj[methodName] = jest.fn().mockName(String(methodName));
  }
  return obj;
}
