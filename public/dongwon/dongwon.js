// Timer
const timerElement = document.querySelector('.main-time');
const millisecondsElement = document.querySelector('.milliseconds');
const priceElement = document.querySelector('.amount');
const remainingPercentageElement = document.querySelector('.stats-card .stat-value'); 

// 푸룬 (4,050)
const pruneCountElement = document.querySelector('.poru-card .stat-value');
// 달러값 
const dollarValueElement = document.querySelector('.won-card .dollar-value');
const exchangeRate = 1429.53;

// 비트코인 (자동화 시켜야할듯. 유지보수 귀찮)
const bitcoinValueElement = document.querySelector('.bitcoin-card .bitcoin-value');
const bitcoinprice = 149874958.08;

const initialPrice = 14000.00;
const initialDate = new Date(2025, 0, 12, 18, 0, 0, 0);
const targetDate = new Date(2025, 0, 31, 17, 0, 0, 0);

function updateTimer() {
    const now = new Date();
    const timeDiff = targetDate - now;

    if (timeDiff <= 0) {
        timerElement.textContent = "D-Day!";
        millisecondsElement.textContent = "";
        remainingPercentageElement.textContent = "0%";
        return;
    }

    const totalMilliseconds = targetDate - initialDate;
    const remainingPercentage = Math.round((timeDiff / totalMilliseconds) * 100);

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    const milliseconds = timeDiff % 1000;

    const formattedTime = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
    timerElement.textContent = formattedTime;
    millisecondsElement.textContent = `.${String(milliseconds).padStart(3, '0')}`;
    remainingPercentageElement.textContent = remainingPercentage.toFixed(3) + "%";
    applyAnimation(timerElement);
}

// 애니메이션 적용쪽
// 근데 거의 사용하진 않을듯
function applyAnimation(element) {
    element.style.animation = 'fade-in-out 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Unit
function formatPrice(price) {
    const priceStr = String(price);
    const decimalIndex = priceStr.indexOf('.');
    let integerPart = priceStr;
    let decimalPart = '';

    if (decimalIndex !== -1) {
        integerPart = priceStr.substring(0, decimalIndex);
        decimalPart = priceStr.substring(decimalIndex);
    }

    const len = integerPart.length;
    let formattedPrice = '';

    if (len <= 4) {
        formattedPrice = integerPart;
    } else if (len <= 8) {
        formattedPrice = integerPart.substring(0, len - 4) + '만 ' + integerPart.substring(len - 4);
    } else {
        formattedPrice = integerPart.substring(0, len - 8) + '억 ' + integerPart.substring(len - 8, len - 4) + '만 ' + integerPart.substring(len - 4);
    }

    return formattedPrice + decimalPart + '원';
}

// Unit 2 (기타용)
function formatNumberWithUnits(number) {
    const priceStr = String(number);
    const decimalIndex = priceStr.indexOf('.');
    let integerPart = priceStr;
    let decimalPart = '';

    if (decimalIndex !== -1) {
        integerPart = priceStr.substring(0, decimalIndex);
        decimalPart = priceStr.substring(decimalIndex);
    }

    const len = integerPart.length;
    let formattedPrice = '';

    if (len <= 4) {
        formattedPrice = integerPart;
    } else if (len <= 8) {
        formattedPrice = integerPart.substring(0, len - 4) + '만 ' + integerPart.substring(len - 4);
    } else {
        formattedPrice = integerPart.substring(0, len - 8) + '억 ' + integerPart.substring(len - 8, len - 4) + '만 ' + integerPart.substring(len - 4);
    }

    return formattedPrice + decimalPart;
}

// Price 부분 (4050 기준)
function updatePrice() {
    const now = new Date();
    const timeDiff = now - initialDate;
    const secondsDiff = Math.floor(timeDiff / 1000);
    const ratePerSecond = (initialPrice * (initialPrice * 0.0015) + (initialPrice * 0.1));
    const currentPrice = initialPrice + (ratePerSecond * secondsDiff);

    priceElement.textContent = formatPrice(currentPrice.toFixed(0));
    applyAnimation(priceElement);

    const pruneCount = Math.floor(currentPrice / 4050); // 푸룬주스 가격 (딥워터 기준)
    pruneCountElement.textContent = formatNumberWithUnits(pruneCount);

    const dollarValue = currentPrice / exchangeRate;
    dollarValueElement.textContent = formatNumberWithUnits(dollarValue.toFixed(0));
    applyAnimation(dollarValueElement);

    const bitcoinValue = currentPrice / bitcoinprice;
    bitcoinValueElement.textContent = formatNumberWithUnits(bitcoinValue.toFixed(8));
    applyAnimation(bitcoinValueElement);
}

setInterval(() => {
    updateTimer();
    updatePrice();
}, 10);


// BackGround 부분
// const backgroundImage = "https://cdn.discordapp.com/attachments/1313056275407441970/1332942139717320794/image.png?ex=6797169a&is=6795c51a&hm=a76a2a6f9645e9c981a39d8cc91d535d11f1857eaaf80a82f3e1c3f7ad8dbfba&";
// document.body.style.backgroundImage = `url(${backgroundImage})`;
// document.body.style.backgroundSize = "cover";
// document.body.style.backgroundRepeat = "no-repeat";
// document.body.style.backgroundposition = "center";








// 댓글
const commentsContainer = document.getElementById('comments');
const nicknameInput = document.getElementById('nickname');
const commentInput = document.getElementById('comment');
const nicknameCounter = document.getElementById('nickname-counter');
const commentCounter = document.getElementById('comment-counter');

function addComment(){
    const nickname = nicknameInput.value;
    const comment = commentInput.value;

    if(nickname.trim() === "" || comment.trim() === ""){
        alert("닉네임과 댓글을 입력하세요");
        return;
    }

    fetch('/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nickname, comment })
    })
    .then(response => response.json())
    .then(data => {
        getComments();
        commentInput.value = '';
        commentCounter.textContent = `0/125`;
    });

}

// Get Comments 부분.
function getComments(){
    fetch('/comments')
    .then(response => response.json())
    .then(data => {
        commentsContainer.innerHTML = '';
        data.slice(0,10).reverse().forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.innerHTML = `<strong>${comment.nickname}:</strong> ${comment.comment}`;
            commentsContainer.appendChild(commentDiv);
        });
    });
}


nicknameInput.addEventListener('input', () => {
    const nicknameLength = nicknameInput.value.length;
    nicknameCounter.textContent = `${nicknameLength}/7`;
    if (nicknameLength > 7) {
        nicknameInput.value = nicknameInput.value.substring(0, 7);
    }
});

commentInput.addEventListener('input', () => {
    const commentLength = commentInput.value.length;
    commentCounter.textContent = `${commentLength}/125`;
    if (commentLength > 125) {
        commentInput.value = commentInput.value.substring(0, 125);
    }
});

setInterval(() => {
    getComments();
}, 100);


// 동원이가 자기가 귀엽다는데 조금 개가타용. 
const connectPlayerSpan = document.getElementById('connect-player');
const socket = io();

socket.on('userCount', (count) => {
    connectPlayerSpan.textContent = `접속자 ${count}명`;
});