import { useState, useEffect } from "react";
import { CalculationIcon, DisplayIcon, EyeIcon, LineIcon, ScaleIcon, TextIcon } from "./components/Icons/FontIcons";

function App() {
  const [baseSize, setBaseSize] = useState(16);
  const [details, setDetails] = useState(false);
  const [ratio, setRatio] = useState(1.333);
  const [lineHeightRatio] = useState(1.5);
  const [trackingBase] = useState(0);
  const [marginRatio] = useState(1);
  const [bodyText, setBodyText] = useState("This is the preview text");
  const [results, setResults] = useState([]);

  // Font styling states
  const [selectedFont, setSelectedFont] = useState("Helvetica");
  const [fontWeight, setFontWeight] = useState("400");
  const [isItalic, setIsItalic] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);

  const scales = {
    1.125: "Major Second",
    1.2: "Minor Third",
    1.25: "Major Third",
    1.333: "Major Fourth",
    1.414: "Augmented Fourth",
    1.5: "Perfect Fifth",
    1.618: "Golden Ratio",
  };

  // Google Fonts with their available weights
  const fonts = {
    Helvetica: {
      weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      italic: true,
      system: true,
    },
    Inter: {
      weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      italic: true,
    },
    Roboto: {
      weights: ["100", "300", "400", "500", "700", "900"],
      italic: true,
    },
    "Open Sans": {
      weights: ["300", "400", "500", "600", "700", "800"],
      italic: true,
    },
    Lato: { weights: ["100", "300", "400", "700", "900"], italic: true },
    Montserrat: {
      weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      italic: true,
    },
    Poppins: {
      weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      italic: true,
    },
    "Playfair Display": {
      weights: ["400", "500", "600", "700", "800", "900"],
      italic: true,
    },
    Merriweather: { weights: ["300", "400", "700", "900"], italic: true },
    Arial: { weights: ["400", "700"], italic: true, system: true },
    "Times New Roman": { weights: ["400", "700"], italic: true, system: true },
    Georgia: { weights: ["400", "700"], italic: true, system: true },
    "Courier New": { weights: ["400", "700"], italic: true, system: true },
    Verdana: { weights: ["400", "700"], italic: true, system: true },
  };

  const weightLabels = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semibold",
    700: "Bold",
    800: "ExtraBold",
    900: "Black",
  };

  const levels = [
    { name: "H1", step: 5, trackingAdjust: -20, lineHeightAdjust: -0.1 },
    { name: "H2", step: 4, trackingAdjust: -15, lineHeightAdjust: -0.05 },
    { name: "H3", step: 3, trackingAdjust: -10, lineHeightAdjust: 0 },
    { name: "H4", step: 2, trackingAdjust: -5, lineHeightAdjust: 0 },
    { name: "H5", step: 1, trackingAdjust: 0, lineHeightAdjust: 0 },
    { name: "Body", step: 0, trackingAdjust: 0, lineHeightAdjust: 0 },
    { name: "Small", step: -1, trackingAdjust: 10, lineHeightAdjust: 0.1 },
  ];

  // Load Google Font dynamically
  useEffect(() => {
    const fontConfig = fonts[selectedFont];
    if (fontConfig && !fontConfig.system) {
      // const weights = fontConfig.weights.join(';')
      const italic = fontConfig.italic
        ? ":ital,wght@0," +
          fontConfig.weights.join(";0,") +
          ";1," +
          fontConfig.weights.join(";1,")
        : ":wght@" + fontConfig.weights.join(";");
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(
        " ",
        "+"
      )}${italic}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [selectedFont]);

  useEffect(() => {
    const calculated = levels.map((level, index) => {
      const size = baseSize * Math.pow(ratio, level.step); // Font Size
      const rem = (size / 16).toFixed(2); // Font Size in rem conversion

      const adjustedLineHeight = lineHeightRatio + level.lineHeightAdjust; // Adjusted Line Height
      const lineHeight = (size * adjustedLineHeight).toFixed(1); // Line Height in px
      const lineHeightRem = (lineHeight / 16).toFixed(2); // Line Height in rem

      const tracking = trackingBase + level.trackingAdjust; //  Letter spacing calculation  
      const letterSpacing = (tracking / 1000).toFixed(4); // Letter spacing in em
      const letterSpacingPx = (size * (tracking / 1000)).toFixed(2); // Letter spacing in px

      const marginTop =
        index > 0 ? (lineHeight * marginRatio * 1.5).toFixed(2) : 0; // Top Margin
      const marginBottom = (lineHeight * marginRatio * 0.5).toFixed(2); // Bottom Margin
      const marginTopRem = (marginTop / 16).toFixed(3); // Top Margin in rem
      const marginBottomRem = (marginBottom / 16).toFixed(3); // Bottom Margin in rem

      const clampMin = size * 0.8; 
      const clampMax = size * 1.2; 
      const clamp = `clamp(${clampMin.toFixed(
        2 
      )}px, ${rem}rem + 0.5vw, ${clampMax.toFixed(2)}px)`; 

      return {
        ...level,
        px: size.toFixed(0),
        rem,
        clamp,
        formula: `${baseSize} × ${ratio}^${level.step}`,
        lineHeight: lineHeight,
        lineHeightRem,
        lineHeightFormula: `${size.toFixed(2)} × ${adjustedLineHeight.toFixed(
          2
        )}`,
        lineHeightRatio: adjustedLineHeight.toFixed(2),
        tracking,
        letterSpacing,
        letterSpacingPx,
        letterSpacingFormula: `${tracking} / 1000`,
        marginTop,
        marginBottom,
        marginTopRem,
        marginBottomRem,
        marginFormula: `${lineHeight} × ${marginRatio}`,
      };
    });
    setResults(calculated);
  }, [baseSize, ratio, lineHeightRatio, trackingBase, marginRatio]);



  return (
    <div className="min-h-screen bg-[#FFF6C7] px-8 py-12 font text-[#456DA8]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold/50 text-[#456DA8] mb-3">
            Typography Scale Calculator
          </h1>
          <p className="text-black/50 text-lg">
            Easy to use type scale generator for consistent typography.
          </p>
        </div>

        {/* Font Selection Card */}
        <div className="bg-white/31 stroke-[1E293B]/12 rounded-2xl shadow-lg p-8 mb-6 grid gap-14">
          <div className="flex flex-wrap items-start gap-6">
            {/* Font Family Dropdown */}
            <div className="shrink-0 w-80">
              <select
                value={selectedFont}
                onChange={(e) => {
                  setSelectedFont(e.target.value);
                  const newFont = fonts[e.target.value];
                  if (!newFont.weights.includes(fontWeight)) {
                    setFontWeight(
                      newFont.weights.includes("400")
                        ? "400"
                        : newFont.weights[0]
                    );
                  }
                  if (!newFont.italic) {
                    setIsItalic(false);
                  }
                }}
                className="w-full px-5 py-3 text-lg border border-[#456DA8] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent
                -moz-appearance: none;
    -webkit-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;"
              >
                <optgroup label="System Fonts">
                  {Object.keys(fonts)
                    .filter((f) => fonts[f].system)
                    .map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Google Fonts">
                  {Object.keys(fonts)
                    .filter((f) => !fonts[f].system)
                    .map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                </optgroup>
              </select>
              <p className="text-sm text-black/50 mt-1">
                Select a font from google font
              </p>
            </div>

            {/* Font Style Controls */}
            <div className="flex-1 ">
              <div className="flex flex-wrap gap-2 ">
                {/* Italic Button */}
                <button
                  onClick={() => setIsItalic(!isItalic)}
                  disabled={!fonts[selectedFont].italic}
                  className={`rounded-lg font-bold border-[#676767] text-lg px-5 text-[#676767] py-2 ${
                    isItalic ? "   border-2 " : " "
                  } ${
                    !fonts[selectedFont].italic
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  Italic
                </button>

                {/* UPPERCASE Button */}
                <button
                  onClick={() => setIsUppercase(!isUppercase)}
                  className={`rounded-lg font-bold border-[#676767] text-lg px-5 text-[#676767] py-2 ${
                    isUppercase ? "border-2" : ""
                  }`}
                >
                  UPPERCASE
                </button>

                {/* Weight Buttons */}
                {fonts[selectedFont].weights.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setFontWeight(weight)}
                    className={`rounded-lg font-bold border-[#676767] text-lg px-5 text-[#676767] py-2 ${
                      fontWeight === weight ? "border-2" : ""
                    }`}
                  >
                    {weightLabels[weight] || weight}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* </div> */}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Base Size */}
            <div>
              <label className="flex items-center gap-2 text-base font-semibold text-[#456DA8] mb-3">
                Base Size
                <span className="text-xl">
                  <TextIcon width={26} height={26} />
                </span>{" "}
              </label>
              <input
                type="text"
                value={`${baseSize} px`}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value) setBaseSize(Number(value));
                }}
                className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Scale Ratio */}
            <div>
              <label className="flex items-center gap-2 text-base font-semibold text-[#456DA8] mb-3">
                Scale Ratio
                <span className="text-xl">
                  <ScaleIcon />
                </span>{" "}
              </label>
              <select
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(scales).map(([value, name]) => (
                  <option key={value} value={value}>
                    {value} - {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Text */}
            <div>
              <label className="flex items-center gap-2 text-base font-semibold text-[#456DA8] mb-3">
                Preview Text
                <span className="text-xl">
                  <EyeIcon />
                </span>{" "}
              </label>
              <input
                type="text"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Toggle Buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full bg-white/10 p-1 border border-[#3B82F6]">
              <button
                onClick={() => setDetails(true)}
                aria-pressed={details}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all text-sm font-medium ${
            details
              ? "bg-[#3B82F6] text-white"
              : "bg-transparent text-[#3B82F6]"
                }`}
              >
                <span className="inline-flex items-center">
            <CalculationIcon
              width={18}
              height={18}
              className={details ? "text-white" : "text-[#3B82F6]"}
            />
                </span>
                <span>View Calculations</span>
              </button>

              <button
                onClick={() => setDetails(false)}
                aria-pressed={!details}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all text-sm font-medium ${
            !details
              ? "bg-[#3B82F6] text-white"
              : "bg-transparent text-[#456DA8]"
                }`}
              >
                <span className="inline-flex items-center">
            <DisplayIcon
              width={18}
              height={18}
              className={!details ? "text-white" : "text-[#456DA8]"}
            />
                </span>
                <span>Display Text</span>
              </button>
            </div>
          </div>
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className="bg-white/31 stroke-[1E293B]/12 rounded-2xl shadow-lg p-8">
              {/* Header */}
              <div className="border-b-2 border-gray-200 pb-6 mb-6">
                <h2 className="text-3xl font-bold text-[#456DA8] mb-4">
                  {result.name}
                </h2>

                <div className="flex flex-wrap gap-6 text-sm justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#456DA8] text-lg"><TextIcon width={24} height={24}/></span>
                    <span className="text-gray-600">Size :</span>
                    <span className="font-mono font-semibold">
                      {result.px} px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#456DA8] text-lg"><TextIcon width={24} height={24}/></span>
                    <span className="text-gray-600">rem :</span>
                    <span className="font-mono font-semibold">
                      {result.rem}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#456DA8] text-lg"><LineIcon width={24} height={24}/></span>
                    <span className="text-gray-600">Line height :</span>
                    <span className="font-mono font-semibold">
                      {result.lineHeight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview or Details */}
              {!details ? (
                <div className="py-4">
                  <p
                    style={{
                      fontFamily: selectedFont,
                      fontSize: `${result.px}px`,
                      fontWeight: fontWeight,
                      fontStyle: isItalic ? "italic" : "normal",
                      textTransform: isUppercase ? "uppercase" : "none",
                      lineHeight: `${result.lineHeight}px`,
                      letterSpacing: `${result.letterSpacing}em`,
                      color: "#4B6FA6",
                    }}
                  >
                    {bodyText}
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-sm text-blue-900 mb-3">
                      Font Size
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Pixels:</span>{" "}
                        <span className="font-mono text-[#456DA8] ml-2">
                          {result.px}px
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rem:</span>{" "}
                        <span className="font-mono text-[#456DA8] ml-2">
                          {result.rem}rem
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Formula:</span>{" "}
                        <span className="font-mono text-purple-600 ml-2">
                          {result.formula}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-sm text-green-900 mb-3">
                      Line Height (Leading)
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Pixels:</span>{" "}
                        <span className="font-mono text-green-600 ml-2">
                          {result.lineHeight}px
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Rem:</span>{" "}
                        <span className="font-mono text-green-600 ml-2">
                          {result.lineHeightRem}rem
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ratio:</span>{" "}
                        <span className="font-mono text-green-600 ml-2">
                          {result.lineHeightRatio}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-sm text-orange-900 mb-3">
                      Letter Spacing (Tracking)
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Em:</span>{" "}
                        <span className="font-mono text-orange-600 ml-2">
                          {result.letterSpacing}em
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Pixels:</span>{" "}
                        <span className="font-mono text-orange-600 ml-2">
                          {result.letterSpacingPx}px
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tracking:</span>{" "}
                        <span className="font-mono text-orange-600 ml-2">
                          {result.tracking}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-sm text-purple-900 mb-3">
                      Margins
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Top:</span>{" "}
                        <span className="font-mono text-purple-600 ml-2">
                          {result.marginTop}px ({result.marginTopRem}rem)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Bottom:</span>{" "}
                        <span className="font-mono text-purple-600 ml-2">
                          {result.marginBottom}px ({result.marginBottomRem}rem)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Export Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Tailwind Config
            </h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
              {`fontFamily: {
  'custom': ['${selectedFont}', 'sans-serif'],
},
fontSize: {
${results
  .map(
    (r) => `  '${r.name.toLowerCase()}': ['${r.rem}rem', {
    lineHeight: '${r.lineHeightRem}rem',
    letterSpacing: '${r.letterSpacing}em',
    fontWeight: '${fontWeight}',
  }],`
  )
  .join("\n")}
}`}
            </pre>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              CSS Variables
            </h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
              {`:root {
  --font-family: '${selectedFont}', sans-serif;
  --font-weight: ${fontWeight};
  --font-style: ${isItalic ? "italic" : "normal"};
  --text-transform: ${isUppercase ? "uppercase" : "none"};
${results
  .map(
    (r) => `  --font-${r.name.toLowerCase()}: ${r.rem}rem;
  --line-${r.name.toLowerCase()}: ${r.lineHeightRem}rem;
  --tracking-${r.name.toLowerCase()}: ${r.letterSpacing}em;`
  )
  .join("\n")}
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
