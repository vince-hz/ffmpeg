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
  const new_ffmpeg_source = ffmpeg_source.inputOption('-hwaccel', 'videotoolbox')
  .outputOption('-vcodec h264_videotoolbox') 
  .videoCodec('h264_videotoolbox')
  return { ffmpeg_source: new_ffmpeg_source };
};