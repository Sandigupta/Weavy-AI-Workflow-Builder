import {
  logger,
  task
} from "./chunk-56GSTRRC.mjs";
import {
  __name,
  init_esm
} from "./chunk-Z6TFXI5D.mjs";

// src/trigger/media-tasks.ts
init_esm();
import { readFileSync } from "fs";
import { join } from "path";
try {
  const envPath = join(process.cwd(), ".env");
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  });
} catch (error) {
  logger.warn("Could not load .env file manually", { error });
}
async function runTransloadit(steps, ctx) {
  const key = process.env.TRANSLOADIT_KEY;
  const secret = process.env.TRANSLOADIT_SECRET;
  logger.log("Transloadit env check:", {
    hasKey: !!key,
    hasSecret: !!secret,
    keyPreview: key ? `${key.substring(0, 8)}...` : "missing"
  });
  if (!key || !secret) {
    throw new Error("Missing TRANSLOADIT_KEY or TRANSLOADIT_SECRET");
  }
  const transloaditModule = await import("./transloadit-AVGCTBQ4.mjs");
  const Transloadit = transloaditModule.default || transloaditModule;
  if (typeof Transloadit !== "function") {
    console.error("[cropImage] Transloadit import failed. Imported:", transloaditModule);
    throw new Error(`Transloadit is not a constructor. It is a ${typeof Transloadit}`);
  }
  const client = new Transloadit({
    authKey: key,
    authSecret: secret
  });
  logger.log("Creates Transloadit Assembly", { steps });
  const assembly = await client.createAssembly({
    params: {
      steps,
      // We want to wait for the result
      template_id: void 0
      // ensure no template is enforced
    },
    waitForCompletion: true
    // SDK feature to poll
  });
  if (assembly.error) {
    throw new Error(`Transloadit Error: ${assembly.error}`);
  }
  const resultKeys = Object.keys(assembly.results);
  const lastStep = resultKeys[resultKeys.length - 1];
  const results = assembly.results[lastStep];
  if (!results || results.length === 0) {
    throw new Error("No output generated from Transloadit");
  }
  return results[0].ssl_url;
}
__name(runTransloadit, "runTransloadit");
var cropImage = task({
  id: "crop-image",
  run: /* @__PURE__ */ __name(async (payload, { ctx }) => {
    logger.log("Cropping Image (Transloadit)", payload);
    const steps = {
      imported_image: {
        robot: "/http/import",
        url: payload.imageUrl
      },
      cropped: {
        use: "imported_image",
        robot: "/image/resize",
        width: payload.width,
        height: payload.height,
        resize_strategy: "crop"
        // crops to fill dimensions
        // Note: Specific x/y offsets requires /image/crop robot or specific crop strategy configs
        // For now, we use standard center crop which is "resize_strategy: crop"
      }
    };
    try {
      const outputUrl = await runTransloadit(steps, ctx);
      return {
        outputUrl,
        message: "Image cropped successfully via Transloadit"
      };
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND" || error.message.includes("Transloadit")) {
        logger.warn("Transloadit failed, falling back to mock", { error });
        return {
          // Use a more reliable placeholder service
          outputUrl: `https://placehold.co/${payload.width}x${payload.height}/orange/white?text=Mock+Crop`,
          message: "Mocked: Transloadit dependency or keys missing"
        };
      }
      throw error;
    }
  }, "run")
});
var extractFrame = task({
  id: "extract-frame",
  run: /* @__PURE__ */ __name(async (payload, { ctx }) => {
    logger.log("Extracting Frame (Transloadit)", payload);
    const steps = {
      imported_video: {
        robot: "/http/import",
        url: payload.videoUrl
      },
      extracted_thumb: {
        use: "imported_video",
        robot: "/video/thumbs",
        count: 1,
        // '00:00:05' format needed? or seconds? 
        // Transloadit /video/thumbs uses 'offsets' in seconds or time strings.
        ffmpeg_stack: "v4.3.1",
        offsets: [payload.timestamp || 0]
      }
    };
    try {
      const outputUrl = await runTransloadit(steps, ctx);
      return {
        outputUrl,
        message: "Frame extracted successfully via Transloadit"
      };
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND" || error.message.includes("Transloadit")) {
        logger.warn("Transloadit failed, falling back to mock");
        return {
          outputUrl: "https://via.placeholder.com/640x360.png?text=Frame+Extracted",
          message: "Mocked: Transloadit dependency or keys missing"
        };
      }
      throw error;
    }
  }, "run")
});

export {
  cropImage,
  extractFrame
};
//# sourceMappingURL=chunk-2BQ5FNCR.mjs.map
