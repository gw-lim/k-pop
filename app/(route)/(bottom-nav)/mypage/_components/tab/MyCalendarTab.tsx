"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HorizontalEventCard from "@/components/card/HorizontalEventCard";
import ChipButton from "@/components/chip/ChipButton";
import { sortEvents } from "@/utils/sortEventList";
import { MYPAGE_CALENDAR_STYLE } from "@/constants/calendarStyle";
import NextIcon from "@/public/icon/arrow-left_lg.svg";
import PrevIcon from "@/public/icon/arrow-right_lg.svg";
import { ScheduleDataProps } from "../../page";

const EventTab = ({ scheduleData }: { scheduleData: ScheduleDataProps[] }) => {
  const [data, setData] = useState(scheduleData);
  const [calendarStyle, setCalendarStyle] = useState("");
  let lastDay: (ScheduleDataProps | "blank")[] = [];

  const tileContent = ({ date }: { date: Date }) => {
    const eventsForDate = data.filter((event) => new Date(event.startDate).getTime() <= date.getTime() && new Date(event.endDate).getTime() >= date.getTime());

    if (eventsForDate.length > 0) {
      let today: (ScheduleDataProps | "blank")[] = sortEvents(eventsForDate);

      for (let idx in today) {
        const lastDayItem = lastDay[idx];
        const todayItem = today[idx];
        if (!lastDayItem) {
          lastDay[idx] = todayItem;
          continue;
        }
        if (lastDayItem === todayItem) {
          continue;
        }
        let rpt = 0;
        while (lastDay[Number(idx) + rpt] !== today[Number(idx) + rpt]) {
          if (Number(idx) + rpt > lastDay.length) break;
          today.splice(Number(idx) + rpt, 0, "blank");
          rpt++;
        }
      }

      if (date.getDay() === 1) {
        today = today.filter((item) => item !== "blank");
      }
      lastDay = today;

      return (
        <div>
          {today.map((event, idx) => {
            if (event === "blank") {
              return <span key={idx + event} className={`h-4 rounded-sm`} />;
            }
            let type;
            if (event.startDate === event.endDate) {
              type = SHAPE_TYPE.oneDay;
            } else if (new Date(event.startDate).getTime() === date.getTime()) {
              type = SHAPE_TYPE.firstDay;
            } else if (new Date(event.endDate).getTime() === date.getTime()) {
              type = SHAPE_TYPE.lastDay;
            } else {
              type = SHAPE_TYPE.middleDay;
            }
            return <span key={event.id} className={`h-4 rounded-sm ${type} ${COLOR_TYPE[event.id % 6]}`} />;
          })}
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    setCalendarStyle(MYPAGE_CALENDAR_STYLE);
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleClickToday = (date: any) => {
    if (selectedDate?.getTime() === date.getTime()) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(date);
  };

  const handleHeartClick = () => {
    console.log("내 행사 데이터 다시 받아오기");
  };

  const [currentLabel, setCurrentLabel] = useState("");

  const handleChipClick = (label: "예정" | "진행중" | "종료") => {
    const today = new Date();

    switch (label) {
      case currentLabel:
        setData(scheduleData);
        setCurrentLabel("");
        break;
      case "예정":
        setData(
          scheduleData.filter((event) => {
            return new Date(event.startDate) > today;
          }),
        );
        setCurrentLabel(label);
        break;
      case "종료":
        setData(
          scheduleData.filter((event) => {
            return new Date(event.endDate) < today;
          }),
        );
        setCurrentLabel(label);
        break;
      case "진행중":
        setData(
          scheduleData.filter((event) => {
            return new Date(event.startDate) <= today && new Date(event.endDate) >= today;
          }),
        );
        setCurrentLabel(label);
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-stretch gap-16 px-20 pb-16 pt-72">
      <style>{calendarStyle}</style>
      {calendarStyle !== "" && (
        <Calendar
          locale="ko"
          onChange={handleClickToday}
          value={selectedDate}
          tileContent={tileContent}
          nextLabel={<PrevIcon onClick={() => (lastDay = [])} width={32} height={16} viewBox="0 0 24 24" stroke="#A2A5AA" />}
          prevLabel={<NextIcon onClick={() => (lastDay = [])} width={32} height={16} viewBox="0 0 24 24" stroke="#A2A5AA" />}
          next2Label={null}
          prev2Label={null}
          formatDay={(locale, date) => date.getDate().toString()}
          formatShortWeekday={(locale, date) => {
            const shortWeekdays = ["S", "M", "T", "W", "T", "F", "S"];
            return shortWeekdays[date.getDay()];
          }}
        />
      )}
      <div className="w-full">
        <div className="flex w-full gap-12">
          <ChipButton label="예정" onClick={() => handleChipClick("예정")} selected={currentLabel === "예정"} />
          <ChipButton label="진행중" onClick={() => handleChipClick("진행중")} selected={currentLabel === "진행중"} />
          <ChipButton label="종료" onClick={() => handleChipClick("종료")} selected={currentLabel === "종료"} />
        </div>
        <ul>
          {/* {data
            .filter((event) => !selectedDate || (new Date(event.startDate).getTime() <= selectedDate.getTime() && new Date(event.endDate).getTime() >= selectedDate.getTime()))
            .map((event) => (
              <HorizontalEventCard key={event.id} data={event} hasHeart onHeartClick={handleHeartClick} />
            ))} */}
        </ul>
      </div>
    </div>
  );
};

export default EventTab;

const COLOR_TYPE: Record<number, string> = {
  0: `bg-sub-pink`,
  1: `bg-sub-yellow`,
  2: `bg-sub-skyblue`,
  3: `bg-sub-blue`,
  4: `bg-sub-purple`,
  5: `bg-sub-red`,
};

const SHAPE_TYPE = {
  oneDay: "w-36",
  firstDay: "ml-8 w-44",
  lastDay: "mr-8 w-44",
  middleDay: "w-52",
};
