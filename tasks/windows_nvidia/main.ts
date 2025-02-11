import type { Context } from "@oomol/types/oocana";
import { FfmpegCommand } from "fluent-ffmpeg";

type Inputs = {
  ffmpeg_source: FfmpegCommand;
}
type Outputs = {
  ffmpeg_source: FfmpegCommand;
}

export default async function(
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {
  const {ffmpeg_source} = params;
  const outSource = ffmpeg_source
    .inputOption([
      "-vsync 0",
      "-hwaccel nvdec",
      "-hwaccel_output_format cuvid",
      "-c:v h264_cuvid",
    ])
    .audioCodec("copy")
    .videoCodec("h264_nvenc")
  return { ffmpeg_source: outSource };
};