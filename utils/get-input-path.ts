import { FfmpegCommand } from "fluent-ffmpeg";

export  function getInputPath(ffmpeg_source: FfmpegCommand): string {
    const inputPath = (ffmpeg_source as any)._inputs[0].source;
    return inputPath;
}