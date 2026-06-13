import { Poppins } from "next/font/google";

export const poppins = Poppins({
    variable: "--font-poppins", // define a CSS variable for the front -> use globally in CSS
    subsets: ["latin"], // define the character sets to include
    display: "swap", // define the font display strategy -> ensure the font is visible while loading
    weight: ["100", "400", "500", "800", "900"], // define the font weights to include 
});