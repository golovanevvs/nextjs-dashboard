import { Inter } from "next/font/google";
import { Lusitana } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({ subsets: ["latin"] });
export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const myFont = localFont({
  src: "./ComicCodeLigatures-Regular.otf",
  display: "swap",
});
