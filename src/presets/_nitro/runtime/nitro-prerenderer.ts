import "#nitro-internal-pollyfills";
import { getRequestHeader, getRequestURL, isEvent } from "h3";
import { consola } from "consola";
import { useNitroApp } from "nitropack/runtime";
import { trapUnhandledNodeErrors } from "nitropack/runtime/internal";

const nitroApp = useNitroApp();

nitroApp.hooks.hook("error", (error, context) => {
  if (
    isEvent(context.event) &&
    getRequestHeader(context.event, "x-nitro-prerender")
  ) {
    const url = getRequestURL(context.event).href;
    consola.error(
      `[prerender errror]`,
      `[${context.event.method}]`,
      `[${url}]`,
      error
    );
  }
});

export const localFetch = nitroApp.localFetch;
export const closePrerenderer = () => nitroApp.hooks.callHook("close");

// Trap unhandled errors
trapUnhandledNodeErrors();
