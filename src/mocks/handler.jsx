import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:4000/exerciseList", (req, res, ctx) => {
    return res(
      ctx.json(
      [
        {
            exerciseId : "1",
            exerciseName: "스쿼트",
            exerciseImage: "base64이미지데이터",
            exercisePart: "하체",
            exerciseType: "무산소"
        },
        {
            exerciseId : "2",
            exerciseName: "벤치프레스",
            exerciseImage: "base64이미지데이터",
            exercisePart: "가슴",
            exerciseType: "무산소"
        },
        {
            exerciseId : "3",
            exerciseName: "데드리프트",
            exerciseImage: "base64이미지데이터",
            exercisePart: "하체",
            exerciseType: "무산소"
        },
        {
            exerciseId : "4",
            exerciseName: "러닝",
            exerciseImage: "base64이미지데이터",
            exercisePart: "유산소",
            exerciseType: "유산소"
        },
        {
            exerciseId : "5",
            exerciseName: "체스트 프레스",
            exerciseImage: "base64이미지데이터",
            exercisePart: "가슴",
            exerciseType: "무산소"
        },
        
      ]
      )
    );
  }),
];