type Req_Query_Event = {
  keyword?: string;
  sido?: string;
  gungu?: string;
  startDate?: string;
  endDate?: string;
  tags?: string;
  page?: number;
  size?: number;
};

type Req_Query_Event_Detail = {
  eventId: string;
};

type Req_Query_Event_Like = {
  userId: string;
  eventId: string;
};

type Req_Query_Event_User_Like = {
  status: "" | "예정" | "종료" | "진행중" | "종료제외";
};

type Req_Query_Artist_And_Group = {
  keyword?: string;
  page?: number;
  size?: number;
};

type Req_Query_Member = {
  id: string;
};

type Req_Query_Group_And_Solo = {
  size?: number;
  page?: number;
  keyword?: string;
};

type Req_Query_Review = {
  size: number;
  cursorId: number;
};

type Req_Query_User_Review = {
  size: number;
  cursorId: number;
  userId: string;
};

export type Req_Query_Type = {
  행사목록: Req_Query_Event;
  행사상세: Req_Query_Event_Detail;
  행사좋아요: Req_Query_Event_Like;
  유저좋아요: Req_Query_Event_User_Like;
  아티스트: Req_Query_Artist_And_Group;
  멤버: Req_Query_Member;
  그룹솔로: Req_Query_Group_And_Solo;
  리뷰: Req_Query_Review;
  유저리뷰: Req_Query_User_Review;
};
