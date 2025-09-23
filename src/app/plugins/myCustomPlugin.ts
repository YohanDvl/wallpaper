import { registerPlugin } from "@capacitor/core";

export type WallpaperTarget = 'home' | 'lock' | 'both';

export interface SetWallpaperOptions {
  url: string;
  target?: WallpaperTarget;
}

export interface IMyCustomPlugin{
  setWallpaper: (options: SetWallpaperOptions) => Promise<{ success: boolean }>;
  // Compat opcional: método antiguo
  execute?: () => Promise<{message: string}>;
}

const myCustomPlugin = registerPlugin<IMyCustomPlugin>('myCustomPlugin');
export default myCustomPlugin;
