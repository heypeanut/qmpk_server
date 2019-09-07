const {schoolArr} = require('./video')
function analysis(datas){
  let _data = _normalVideos(datas.data,year)
  let playSchool = [];
  let odds = 0

  if(typeof _data === 'string'){
    return _data
  }

  _data.forEach(item => {
    // 统计胜率
      if (item.winner.includes(name) ) {
        odds = ++odds;
      }
      //取出队伍信息
      if (item.other.team.includes(name)) {
        playSchool.push({ team: item.other, winner: item.winner });
      }
      if (item.watching.team.includes(name)) {
        playSchool.push({ team: item.watching, winner: item.winner });
      }
  });

  return {
    odds:Math.round(odds / _data.length * 100) + "%", //总胜率
    playSchool: _normalPlaySchool(playSchool.slice()), //上场门派
    most_team: _normalMostTeam(playSchool.slice(),name), //最常用阵容
    fighting_timer: _normalFightingTimer(_data.slice()), //战斗时长统计
  }
}

function _normalVideos(list,year){
  const ret = []
  list.forEach(videoData=>{
    if(videoData.video && videoData.region.includes(year)){
      ret.push(videoData)
    }
  })
  return ret.length === 0?`${year}年度PK无对应战队，请重新选择年份或战队名`:ret
}

function _normalPlaySchool(list){
  const ret = []
  list.map(item => {
    item.team["school"].forEach(school => {
      if (ret[school] && ret[school]["school"] === school) {
        ret[school] = {
          school: school,
          ava: `http://img.nnh206.vip/${school}.png`,
          num: ++ret[school].num
        };
      } else {
        ret[school] = {
          school: school,
          ava: `http://img.nnh206.vip/${school}.png`,
          num: 1
        };
      }
    });
  });
  const retArr = [];
  for (let key in ret) {
    retArr.push(ret[key]);
  }
  return retArr;
}

function _normalMostTeam(list,name) {
  //处理最常用阵容
  const _list = list;
  const school = [];
  let ret = {};
  // 拿出所有的阵容原始数据进行排序
  _list.forEach(item => {
    let _school =
      item.team["_school"] instanceof Array
        ? item.team["_school"].slice()
        : [];
    school.push({
      original: item.team._school,
      school: _school.sort((a, b) => {
        return a - b;
      }),
      tactical: [],
      winner: item.winner
    });
  });
  //进行出战数统计
  school.forEach(item => {
    if (
      ret[item.school.join()] &&
      ret[item.school.join()]._school === item.school.join() &&
      item.school.length !== 0
    ) {
      ret[item.school.join()] = {
        _school: item.school.join(),
        num: ++ret[item.school.join()].num,
        winner: item.winner.includes(name)
          ? ++ret[item.school].winner
          : ret[item.school].winner,
        original: item.original,
        school: (() => {
          const _school = item.school;
          const newSchool = [];
          _school.map(item => {
            newSchool.push({
              school: schoolArr[item - 1],
              ava: `http://img.nnh206.vip/${schoolArr[item - 1]}.png`
            });
          });
          return newSchool;
        })()
      };
    } else if (item.school.length !== 0) {
      ret[item.school.join()] = {
        _school: item.school.join(),
        school: (() => {
          const _school = item.school;
          const ret = [];
          _school.map(item => {
            ret.push({
              school: schoolArr[item - 1],
              ava: `http://img.nnh206.vip/${schoolArr[item - 1]}.png`
            });
          });
          return ret;
        })(),
        num: 1,
        original: item.original,
        winner: item.winner.includes(name) ? 1 : 0
      };
    }
  });
  //转换数据结构
  const retArr = [];
  for (let key in ret) {
    retArr.push(ret[key]);
  }
  //排序
  retArr.sort((a, b) => {
    return a.num - b.num;
  });
  return retArr.reverse();
}

function _normalFightingTimer(list) {
  const _list = list.sort((a, b) => {
    return a.videoTime.original - b.videoTime.original;
  });
  // console.log(_list);
  return _list
  // _list.map((item,index)=>{
  //   console.log(item.original)
  // })
}

module.exports = {
  analysis
}