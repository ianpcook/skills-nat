export function Sprocket({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[550px] w-full">
      <svg
        viewBox="0 0 600 500"
        className="absolute right-0 h-full w-auto translate-x-[30%]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <clipPath id="gearClip">
            <path d={gearPath} />
          </clipPath>
        </defs>
        
        {/* Image clipped to gear shape */}
        <image
          href={imageSrc}
          x="50"
          y="0"
          width="500"
          height="500"
          clipPath="url(#gearClip)"
          preserveAspectRatio="xMidYMid slice"
        />
        
        {/* Gear outline */}
        <path
          d={gearPath}
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="4"
        />
        
        {/* Center hole */}
        <circle cx="300" cy="250" r="50" fill="#E9A319" stroke="#0D0D0D" strokeWidth="4" />
      </svg>
    </div>
  );
}

// 12-tooth gear path centered at 300, 250
const gearPath = `
  M 300 40
  L 330 40
  L 335 70
  L 370 80
  L 390 55
  L 415 75
  L 400 105
  L 430 130
  L 460 120
  L 475 150
  L 450 170
  L 465 210
  L 500 210
  L 505 245
  L 470 255
  L 475 295
  L 510 310
  L 500 345
  L 465 340
  L 455 380
  L 480 405
  L 460 435
  L 430 415
  L 400 445
  L 415 475
  L 385 490
  L 360 465
  L 320 470
  L 315 505
  L 280 500
  L 280 465
  L 240 455
  L 215 480
  L 190 460
  L 210 430
  L 180 400
  L 150 420
  L 130 390
  L 160 365
  L 145 325
  L 110 320
  L 115 285
  L 150 280
  L 145 240
  L 110 225
  L 125 190
  L 160 200
  L 180 165
  L 155 140
  L 180 115
  L 210 140
  L 245 115
  L 240 80
  L 275 70
  L 285 105
  A 130 130 0 0 1 315 105
  L 300 40
  Z
`;
