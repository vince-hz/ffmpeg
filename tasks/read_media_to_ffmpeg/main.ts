import type { Context } from "@oomol/types/oocana";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { extractBaseName  } from "../../utils/get-file-name"

type Inputs = Readonly<{ video_source: string }>;
type Outputs = Readonly<{ ffmpeg_source: FfmpegCommand, file_address: string, file_name: string }>;

export default async function (inputs: Inputs, context: Context): Promise<Outputs> {
  const {video_source} = inputs;
  const source = ffmpeg(video_source)
  .outputOption('-c:v', 'libx264') 
  .videoCodec('libx264');
  const file_name = extractBaseName(video_source);
  return { ffmpeg_source: source, file_address: inputs.video_source, file_name: file_name };
};