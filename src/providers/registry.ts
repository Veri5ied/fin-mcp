import * as stripe from "./stripe";

export const providers: Record<string, any> = {
  stripe,
};

export function chooseProvider(currency: string) {
  return providers.stripe;
}
