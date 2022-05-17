// 메뉴 선택에 따른 변경되는 html
const baseUrl = "https://api.hnpwa.com/v0";

// 데이터 가져오기
const fethData = (menuVal, pageVal, dataArr) => {
  axios
    .get(`${baseUrl}/${menuVal}/${pageVal}.json`)
    .then((res) => {
      if (res.data.length === 0) {
        alert("더이상 데이터가 없음");
        // 불필요한 이벤트 차단하기 -- 서버에 부하는 주는 행동차단
        document.querySelectorAll(".morelink")[1].remove();
        return;
      }
      dataArr = dataArr.concat(res.data);
      htmlMaker(menuVal, pageVal, dataArr);
      return dataArr;
    })
    .catch((err) => {
      console.error(err);
      alert("서버 에러발생");
    });
};

// 화면 구성하기 -- 한개의 포멧으로 다 구성한다.
const htmlMaker = (menuVal, pageVal, dataArr) => {
  let template = ``;
  dataArr.forEach((item, index) => {
    template += `
            <tr class="athing" id=${item.id}>
                <td align="right" valign="top" class="title">
                    <span class="rank">${(pageVal - 1) * 30 + index + 1}.</span>
                </td>
                <td valign="top" class="votelinks">
                    <center>
                        <a id="up_${item.id}" href="vote?id=${
      item.id
    }&amp;how=up&amp;goto=newest">
                            <div class="votearrow" title="upvote" />
                        </a>
                    </center>
                </td>
                <td class="title">
                    <a href=${item.url} class="storylink" rel="nofollow">${
      item.title
    }</a>
                    <span class="sitebit comhead">(<a href="from?site=reddit.com"><span class="sitestr">reddit.com</span></a>)</span>
                </td>
           </tr>
           <tr>
                <td colspan="2"></td>
                <td class="subtext">
                    <span class="score" id="score_${
                      item.id
                    }">1 point</span> by <a href="user?id=visualradio" class="hnuser">visualradio</a> 
                    <span class="age" title="2021-07-28T02:53:10"><a href="item?id=${
                      item.id
                    }">0 minutes ago</a></span> 
                    <span id="unv_${
                      item.id
                    }"></span> | <a href="hide?id=27979826&amp;goto=newest">hide</a> | <a href="https://hn.algolia.com/?query=Principles%20of%20Federations&amp;type=story&amp;dateRange=all&amp;sort=byDate&amp;storyText=false&amp;prefix&amp;page=0" class="hnpast">past</a> | <a href="item?id=${
      item.id
    }">discuss</a> 
                </td>
           </tr>
           <tr class="spacer" style="height:5px"></tr>
        `;
  });
  // 더보기 버튼 처리
  template +=
    '<tr class="spacer" style="height:5px"></tr><tr class="spacer" style="height:5px"></tr>';
  
  // 페이지 처리를 위한 항목 추가
  template += `<tr><td colspan="2"></td><td class="title"><a href="javascript:void(0);" onclick="menuMoveEvent('${menuVal}', ${
    pageVal - 1
  } );"  class="morelink" rel="next"> 이 전 </a></td></tr>`;
  template += `<tr><td colspan="2"></td><td class="title"><a href="javascript:void(0);" onclick="menuMoveEvent('${menuVal}', ${
    pageVal + 1
  } );"  class="morelink" rel="next"> 다 음 </a></td></tr>`;
  document.querySelector(".itemlist tbody").innerHTML = template;
};

/**
 * 화면 메뉴선택이나 페이지 더보기를 선택한 경우
 * @param {string} menuVal 메뉴명
 * @param {number} pageVal 페이지번호
 * */
const menuMoveEvent = (menuVal, pageVal) => {
  let dataArr = [];

  if (!pageVal) pageVal = 1;
  if (pageVal === 1) dataArr = [];

  dataArr = fethData(menuVal, pageVal, dataArr);

  // 메뉴영역 요소 가져오기
  const aLinkArr = document.querySelectorAll(".pagetop a");
  // 메뉴영역 선택 관련 기능 선택한 메뉴만 두꺼운 하얀 글자로 표시
  aLinkArr.forEach((el) =>
    el.innerText.toLowerCase().includes(menuVal.toLowerCase())
      ? (el.className = "topsel")
      : (el.className = "")
  );
};
