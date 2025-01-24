import type { Context } from "@oomol/types/oocana";
import { FfmpegCommand } from "fluent-ffmpeg";

type Inputs = Readonly<{
  audio_source: FfmpegCommand,
  file_name: string | null,
  formate: string | null,
  save_address: string | null,
}>;
type Outputs = Readonly<{ file_adress: string }>;
import { extractBaseName  } from "../../utils/get-file-name"
import { getInputPath } from "../../utils/get-input-path";


export default async function (params: Inputs, context: Context): Promise<Outputs> {

  const inputPath = getInputPath(params.audio_source);
  const origin_file_name = extractBaseName(inputPath);
  const file_name = params.file_name ? params.file_name : origin_file_name;
  const formate = params.formate ? params.formate : "mp3";
  const save_address = params.save_address ? `${params.save_address}/${file_name}.${formate}` : `${context.sessionDir}/${file_name}.${formate}`
  try {
    await new Promise((resolve, reject) => {
      params.audio_source
        .save(save_address)
        .inputOption('-hwaccel', 'videotoolbox')
        .videoCodec('h264_videotoolbox').on("end", () => {
          resolve("ok");
        }).on('error', (err) => {
          console.log("ffmpeg error")
          reject(err);
        });
    });
    console.log('Conversion complete');
  } catch (err) {
    console.error('Error during conversion:', err);
  } finally {
    console.log(save_address);
    context.preview({ type: "audio", data: save_address })
    return { file_adress: save_address };
  }
};
