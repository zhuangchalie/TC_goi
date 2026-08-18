# Likely judge questions

**Q: Is it really AI?**
A: The architecture is AI-ready and includes an OpenVINO inference bridge. The
competition prototype's current baseline is explainable heuristic detection;
a trained model is only claimed after benchmark results.

**Q: Why Intel?**
A: OpenVINO provides an edge inference path optimized for Intel hardware,
helping reduce latency and enabling local inference.

**Q: Can it listen to calls?**
A: No covert recording. Android restrictions make unrestricted call-audio access
unreliable. We use post-call event handling and user-approved transcript analysis.

**Q: What happens offline?**
A: The local detector continues to work; network intelligence is optional.

**Q: False positives?**
A: The UI exposes reasons and scores. Production work should calibrate a
classifier and report precision/recall/F1 rather than hide uncertainty.
