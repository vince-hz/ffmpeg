import type { Context } from "@oomol/types/oocana";
import ffmpeg from "fluent-ffmpeg";
import { extractBaseName } from "../../utils/get-file-name"

type Inputs = {
  video_file: string;
  audio_file: string;
  srt: string | null;
  formate: string | null;
  file_name: string | null;
  save_address: string | null;
}
type Outputs = {
  media_file: string;
}

export default async function (
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {
  const { video_file, audio_file, save_address, file_name, formate, srt } = params;
  const origin_file_name = extractBaseName(video_file);
  const the_file_name = file_name ? file_name : origin_file_name;
  const the_formate = formate ? formate : "mp4";
  const the_save_address = save_address ? `${save_address}/${the_file_name}.${the_formate}` : `${context.sessionDir}/${the_file_name}.${the_formate}`;
  try {
    await new Promise((resolve, reject) => {
      const command = ffmpeg()
        .input(video_file)
        .on("start", (commandLine) => {
          console.log(`FFmpeg started with command: ${commandLine}`);
        })

      if (audio_file) {
        command.input(audio_file);
      }

      if (srt) {
        command.outputOption(['-vf', "subtitles=" + srt]);
      }

      command
        .save(the_save_address)
        .on("end", () => {
          resolve("ok");
        })
        .on('error', (err) => {
          console.error("ffmpeg error:", err.message); // 更详细的错误信息输出
          reject(err);
        });
    });
    console.log('Conversion complete');
  } catch (err) {
    console.error('Error during conversion:', err);
  } finally {
    console.log(the_save_address);
    context.preview({ type: "video", data: the_save_address })
    return { media_file: the_save_address };
  }
};
