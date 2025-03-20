import type { Context } from "@oomol/types/oocana";
import { FfmpegCommand } from "fluent-ffmpeg";

type Inputs = {
  ffmpeg_source: FfmpegCommand;
  encodeType: string | null;
};
type Outputs = {
  ffmpeg_source: FfmpegCommand;
};

export default async function (
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {
  const { ffmpeg_source, encodeType } = params;
  let codec = "h264_videotoolbox";
  if (encodeType === "hevc") {
    codec = "hevc_videotoolbox";
  }

  const new_ffmpeg_source = ffmpeg_source
    .inputOption("-hwaccel", "videotoolbox")
    .outputOption(`-vcodec ${codec}`)
    .videoCodec(codec);

  return { ffmpeg_source: new_ffmpeg_source };
};