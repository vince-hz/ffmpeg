import path from "path";

export function extractBaseName(my_path: string): string {
    const basename = path.basename(my_path);
    const extname = path.extname(basename);
    return basename.slice(0, basename.length - extname.length);
}
