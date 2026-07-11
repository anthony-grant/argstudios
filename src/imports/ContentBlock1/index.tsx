import imgRectangle1 from "./2337bc60e5b0c6f54db1a6c41407098db73d64f5.png";

function HImage() {
  return (
    <div className="content-stretch flex gap-[30px] items-end relative shrink-0 w-full" data-name="H-image">
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="text-large">
        <div className="[word-break:break-word] flex flex-col font-['Sul_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#7c1515] text-[36px] w-full">
          <p className="leading-[normal]">Contact</p>
        </div>
      </div>
      <div className="h-[219.993px] relative shrink-0 w-[219.994px]">
        <div className="absolute inset-[-1.22%_-2.73%_-2.73%_-1.22%]">
          <img alt="" className="block max-w-none size-full" height="228.679" src={imgRectangle1} width="228.68" />
        </div>
      </div>
    </div>
  );
}

export default function ContentBlock() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start p-[60px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 90, 95) 0%, rgb(255, 90, 95) 100%), linear-gradient(90deg, rgb(0, 148, 255) 0%, rgb(0, 148, 255) 100%)" }} data-name="content_block - 1">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="text-large">
        <div className="[word-break:break-word] flex flex-col font-['Sul_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[80px] text-white w-full">
          <p className="leading-[normal] whitespace-pre-wrap">
            {`anthony grant is a Designer of `}
            <br aria-hidden />
            {`user interfaces & brands / visual artist living and creating in the Bay Area, California.`}
          </p>
        </div>
      </div>
      <HImage />
    </div>
  );
}