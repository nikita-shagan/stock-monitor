import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Stack from "@/components/stack/stack";

type ChartData = {
  datetime: string;
  close: number;
};

type RsiData = {
  datetime: string;
  rsi: number;
};

type MacdData = {
  datetime: string;
  macd: number;
  macd_signal: number;
};

export default function Chart(props: {
  data: ChartData[];
  rsiData?: RsiData[];
  macdData?: MacdData[];
}) {
  const { data, rsiData, macdData } = props;
  return (
    <Stack>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="datetime" tick={{ fontSize: 10 }} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip labelStyle={{ color: "#333" }} />
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {rsiData && (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={rsiData}>
            <XAxis dataKey="datetime" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip labelStyle={{ color: "#333" }} />
            <Line type="monotone" dataKey="rsi" stroke="#82ca9d" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {macdData && (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={macdData}>
            <XAxis dataKey="datetime" tick={{ fontSize: 10 }} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip labelStyle={{ color: "#333" }} />
            <Line type="monotone" dataKey="macd" stroke="#ffc658" dot={false} />
            <Line
              type="monotone"
              dataKey="macd_signal"
              stroke="#ff7300"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Stack>
  );
}
