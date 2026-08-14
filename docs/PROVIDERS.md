# Provider contracts

Phase 1 defines five provider roles: voice, image generation, video generation, lip sync, and video review. Each provider exposes a descriptor and an asynchronous operation. The descriptor is runtime-validated before routing.

Routing begins with requirements:

```ts
compatibleProviders(descriptors, {
  kind: "video",
  capabilities: { imageToVideo: true, referenceImages: true },
  durationSeconds: 4,
  aspectRatio: "9:16",
});
```

The result is a stable compatible shortlist, not a vendor choice policy. Phase 2 may rank it by project permission, quality evidence, latency, cost, region, and availability. Vendor names must not appear in the `VideoSpec` except as generated-asset or render provenance.

## Adapter requirements

A provider implementation must:

- declare only capabilities it can fulfill in the configured account/region
- accept an idempotency key and abort signal
- return stable task and output identifiers
- preserve prompts, source references, disclosures, and provider IDs needed for provenance
- normalize remote errors without hiding the original code
- keep credentials out of profiles, specs, logs, and committed files

No ElevenLabs, Gemini, Veo, OpenAI, Anthropic, or lip-sync client is implemented in Phase 1.

