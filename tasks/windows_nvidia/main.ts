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
  
  // 修正编解码器映射关系
  const decoder = encodeType === "hevc" ? "hevc_cuvid" : "h264_cuvid";
  const encoder = encodeType === "hevc" ? "hevc_nvenc" : "h264_nvenc";

  const outSource = ffmpeg_source
    .inputOption([
      "-vsync", "0",                // 拆分参数
      "-hwaccel", "nvdec",          // 拆分参数
      "-hwaccel_output_format", "cuvid",
      "-c:v", decoder              // 使用正确的解码器
    ])
    .audioCodec("copy")
    .videoCodec(encoder);           // 使用正确的编码器

  return { ffmpeg_source: outSource };
};