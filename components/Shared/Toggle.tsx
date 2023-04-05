import { ToggleItem, WhereToDisplay } from "@/types";
import { FC, useState } from "react";

interface Props {
  items: [ToggleItem, ToggleItem];
}

export const Toggle: FC<Props> = ({ items }) => {
  const [selected, setSelected] = useState<WhereToDisplay>(
    WhereToDisplay.PANEL_DESTINATION
  );

  const handleSelection = (whereToDisplay: WhereToDisplay) => {
    setSelected(whereToDisplay);
  };

  console.log(selected);

  return (
    <div className=" flex flex-row justify-between items-center rounded-[40px] box-border bg-[rgba(255,255,255,1)]">
      <div
        className="flex items-center px-[20px] py-[10px] rounded-[40px] box-border"
        style={{
          backgroundColor: `${
            selected === items[0].type
              ? "rgba(255,86,0,1)"
              : "rgba(255,255,255,1)"
          }`,
          cursor: `${selected === items[0].type ? "default" : "pointer"}`,
        }}
        onClick={() => handleSelection(items[0].type)}
      >
        <p className="  text-sm  leading-[14px] font-commissioner  font-[700]">
          {items[0].label}
        </p>
      </div>
      <div
        className="flex items-center px-[20px] py-[10px] rounded-[40px] box-border"
        style={{
          backgroundColor: `${
            selected === items[1].type
              ? "rgba(255,86,0,1)"
              : "rgba(255,255,255,1)"
          }`,
          cursor: `${selected === items[1].type ? "default" : "pointer"}`,
        }}
        onClick={() => handleSelection(items[1].type)}
      >
        <p className="  text-sm  leading-[14px] font-commissioner  font-[700]">
          {items[1].label}
        </p>
      </div>
      {/* {selected === WhereToDisplay.PANEL_DESTINATION ? (
        <>
          <div className="flex items-center h-[100%] px-[20px] py-[10px] rounded-[40px] box-border">
            <p className="  text-sm  leading-[14px]  font-commissioner  font-[700]">
              {items[0].label}
            </p>
          </div>
          <div className="flex items-center">
            <p className="  text-sm  leading-[14px] px-[20px] py-[10px] font-commissioner  font-[700]">
              {items[1].label}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <p className="  text-sm  leading-[14px] px-[20px] py-[10px] font-commissioner  font-[700]">
              {items[0].label}
            </p>
          </div>
          <div className="flex items-center px-[20px] py-[10px] rounded-[40px] box-border  bg-[rgba(255,86,0,1)]">
            <p className="  text-sm  leading-[14px]  font-commissioner  font-[700]">
              {items[1].label}
            </p>
          </div>
        </>
      )} */}
    </div>
  );
};
