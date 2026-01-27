export function Sprocket({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[550px] w-full overflow-visible">
      <svg
        viewBox="0 0 600 500"
        className="absolute right-0 h-full w-auto translate-x-[40%]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <clipPath id="diamondClip">
            <path d={diamondPath} />
          </clipPath>
        </defs>
        
        {/* Image clipped to diamond shape */}
        <image
          href={imageSrc}
          x="-150"
          y="0"
          width="900"
          height="750"
          clipPath="url(#diamondClip)"
          preserveAspectRatio="xMaxYMax slice"
        />
        
        {/* Diamond outline */}
        <path
          d={diamondPath}
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

// Diamond path - rotated square, centered at 300, 250
// Points: top, right, bottom, left
const diamondPath = `
  M 300 20
  L 550 250
  L 300 480
  L 50 250
  Z
`;
