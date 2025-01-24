import type { Context } from "@oomol/types/oocana";
import ffmpeg from "fluent-ffmpeg";

type Inputs = {
  audio_files: string[];
  name: string | null;
  format: string | null;
  save_address: string | null;
}
type Outputs = {
  save_address: string;
}

export default async function(
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {
  const {audio_files, name, format, save_address} = params
  const audio_name = name || 'merged_audio';
  const audio_format = format || 'mp3';
  const outputFile = `${audio_name}.${audio_format}`;
  const outputDir = save_address || context.sessionDir;

  try {
    await mergeMP3Files(audio_files, outputFile, outputDir);
    console.log('Files merged successfully:', outputFile);
  } catch (err) {
    console.error('Merge failed:', err.message);
  }

  return { save_address: `${outputDir}/${outputFile}` };
};

// 合并 MP3 文件的异步函数
async function mergeMP3Files(inputFiles: string[], outputFile: string, tempDir: string) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();

    // 添加输入文件
    inputFiles.forEach(file => command.input(file));

    // 合并文件
    command
      .on('end', () => resolve(outputFile))
      .on('error', (err) => reject(err))
      .mergeToFile(outputFile, tempDir);
  });
}