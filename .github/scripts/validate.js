const fs = require("fs");
function fail(m){ console.error("X 校验失败: "+m); process.exit(1); }
let data;
try { data = JSON.parse(fs.readFileSync("schedule-widget.json","utf8")); }
catch(e){ fail("schedule-widget.json 不是合法 JSON: "+e.message); }
if(!data.semester) fail("缺少 semester");
if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(data.semester.startDate||"")) fail("semester.startDate 格式应为 YYYY-MM-DD");
if(!Array.isArray(data.courses)||!data.courses.length) fail("courses 为空");
data.courses.forEach((c,i)=>{
  ["id","name","day","startPeriod","endPeriod","weeks"].forEach(k=>{ if(c[k]===undefined) fail("course["+i+"] 缺字段 "+k); });
  if(c.day<1||c.day>7) fail("course["+i+"] day 超出 1-7");
  if(c.startPeriod<1||c.endPeriod>12||c.startPeriod>c.endPeriod) fail("course["+i+"] 节次越界");
});
const p=data.semester.startDate.split("-").map(Number);
const start=new Date(p[0],p[1]-1,p[2]); const now=new Date();
const week=Math.floor(Math.round((now-start)/86400000)/7)+1;
console.log("OK 校验通过："+data.courses.length+" 门课，当前约第 "+week+" 周");
