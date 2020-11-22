(function () {
  const mv = window.matchMedia('(min-width: 767px)');
  window.addEventListener('scroll', function () {
    const navigation = document.querySelector('.menu-navigation');

    if (this.scrollY >= 67 && mv.matches) {
      navigation.classList.add('scrolling');
    } else {
      navigation.classList.remove('scrolling');
    }
  });

  const toggle = document.getElementById('menu-toggle');
  toggle.addEventListener('click', function () {
    const mainNav = document.querySelector('.main-nav');
    const mainContent = document.querySelector('.main-content');
    mainNav.classList.toggle('nav-open');
    mainContent.style.marginTop = mainNav.scrollHeight + 'px';
  });

  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    body: JSON.stringify({
      query: `{
  user(login: "whitehox") {
    avatarUrl
    bio
    email
    company
    name
    login
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    status {
      emoji
    }
    location
    twitterUsername
    repositories(first: 20, ownerAffiliations: [OWNER], orderBy:{field: PUSHED_AT, direction: DESC}) {
      edges {
        node {
          id
          name
          primaryLanguage {
            color
            name
          }
          updatedAt
          pushedAt
          isPrivate
          stargazerCount
          forkCount
          shortDescriptionHTML(limit: 100)
          licenseInfo {
            name
          }
        }
      }
    }
  }
}`,
    }),
  })
    .then((res) => res.json())
    .then(({ data }) => {
      const repoList = document.querySelector('.repository-list ul');

      repoList.innerHTML = renderRepos(data).join('');
      const accountDetails = document.querySelector('.account-stats-contacts');
      accountDetails.innerHTML = renderUserAcctounDetails(data);

      const userProfile = document.querySelector('.user-profile');
      userProfile.innerHTML = renderUserProfile(data);
    });

  function renderUserProfile(data) {
    const { avatarUrl, login, status, name, bio } = data.user;

    const emojiMap = {
      ':house:': '&#127968;',
    };

    return `<div class="user-details">
            <img src=${avatarUrl} />
            <div>
              <h1>${name}</h1>
              <span>${login}</span>
            </div>
          </div>
          <div class="user-status">
            <p>
            ${emojiMap[status.emoji]}
              <span>
                ${status.message}
              </span>
            </p>
          </div>
        <p class="user-about font-16 m-b-16">${bio}</p>
          `;
  }

  function renderUserAcctounDetails(data) {
    const {
      email,
      company,
      twitterUsername,
      followers,
      following,
      starredRepositories,
      location,
      login,
    } = data.user;

    return `<div class="account-stats d-flex align-center m-b-16">
            <div class="stat d-flex align-center">
            <a class="d-flex align-center" href=${`https://github.com/${login}?tab=followers`}>
              <svg class="octicon octicon-people text-gray-light" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z">
                </path>
              </svg>
              <span class="count">${followers.totalCount}</span>
              <span class="name">followers</span>
            </a>
              <i>.&nbsp;</i>
            </div>
            <div class="stat d-flex align-center">
            <a class="d-flex align-center" href=${`https://github.com/${login}?tab=following`}>
              <span class="count">${following.totalCount}</span>
              <span class="name">following</span>
            </a>
              <i>.&nbsp;</i>
            </div>
            <div class="stat d-flex align-center">
            <a class="d-flex align-center" href=${`https://github.com/${login}?tab=stars`}>            
              <svg class="octicon octicon-star text-gray-light" height="16" viewBox="0 0 16 16" version="1.1" width="16"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
                </path>
              </svg>
              <span class="count">${starredRepositories.totalCount}</span>
            </a>
            </div>
          </div>
          <div class="account-contact d-flex d-cols">
            <ul class="no-ls-style">
              <li class="d-none-desktop">
                <span>
                  <svg class="octicon octicon-organization" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v1.25h2.25a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5a.25.25 0 00-.25.25v12.5zM1.75 16A1.75 1.75 0 010 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 00.25-.25V8.285a.25.25 0 00-.111-.208l-1.055-.703a.75.75 0 11.832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0114.25 16h-3.5a.75.75 0 01-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 01-.75-.75V14h-1v1.25a.75.75 0 01-.75.75h-3zM3 3.75A.75.75 0 013.75 3h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 3.75zM3.75 6a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM3 9.75A.75.75 0 013.75 9h.5a.75.75 0 010 1.5h-.5A.75.75 0 013 9.75zM7.75 9a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM7 6.75A.75.75 0 017.75 6h.5a.75.75 0 010 1.5h-.5A.75.75 0 017 6.75zM7.75 3a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5z">
                    </path>
                  </svg>
                  <a href=${`https://github.com/${company.replace(
                    /@/g,
                    '',
                  )}`} class="org">
                    ${company}
                  </a>
                </span>
              </li>
              <li class="d-none-desktop">
                <span class="d-flex align-center">
                  <svg class="octicon octicon-location" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z">
                    </path>
                  </svg>
                  ${location}
                </span>
              </li>
              <li>
                <span class="d-flex align-center">
                  <svg class="octicon octicon-mail" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M1.75 2A1.75 1.75 0 000 3.75v.736a.75.75 0 000 .027v7.737C0 13.216.784 14 1.75 14h12.5A1.75 1.75 0 0016 12.25v-8.5A1.75 1.75 0 0014.25 2H1.75zM14.5 4.07v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81zm-13 1.74v6.441c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809z">
                    </path>
                  </svg>
                  <a href=${`mailto:${email}`}>
                    ${email}
                  </a>
                </span>
              </li>
              <li class="d-none-desktop">
                <span class="d-flex align-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" class="octicon">
                    <path
                      d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
                      fill="currentColor"></path>
                  </svg>
                  <a href=${`https://twitter.com/${twitterUsername}`} class="no-decor">
                    @${twitterUsername}
                  </a>
                </span>
              </li>
            </ul>
          </div>`;
  }

  function renderRepos(data) {
    return data.user.repositories.edges.map(({ node }) => {
      return `<li class="d-flex">
        <div class="repo-det">
          <h3>
            <a class="repo-link">${node.name}</a>
            ${node.isPrivate ? '<span class="repo-label">Private</span>' : ''}
          </h3>
          <p>${node.shortDescriptionHTML}</p>
          <div class="repo-lang-stamp d-flex">
          ${
            node.primaryLanguage
              ? `<span class="lang d-flex">
              <div class="indentifier" style="background-color: ${node.primaryLanguage?.color}"></div>
              <span>${node.primaryLanguage?.name}</span>
            </span>`
              : ''
          }
          ${
            node.stargazerCount
              ? `<span class="m-r-16 d-flex align-center">
              <svg aria-label="star" class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
              ${node.stargazerCount}
              </span>`
              : ''
          }
          ${
            node.forkCount
              ? `<span class="m-r-16 d-flex align-center">
              ${node.forkCount}
              <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
              </span>`
              : ''
          }
          ${
            node.licenseInfo
              ? `<span class="m-r-16 d-flex align-center">
                    <svg class="octicon octicon-law mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg>
                    ${node.licenseInfo.name}
                  </span>`
              : ''
          }
            <span>
               ${lastUpdated(new Date(node.pushedAt))}
            </span>
          </div>
        </div>
        <div class="star">
          <button class="btn">
            <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
              </path>
            </svg> Star
          </button>
        </div>
      </li>`;
    });
  }

  //Converts Datetime to last updated format
  function lastUpdated(date) {
    let today = new Date();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;

    const timeDifference = today.getTime() - date.getTime();

    let seconds = Math.floor(date.getTime() / 1000);
    let currentSeconds = Math.floor(today.getTime() / 1000);
    let dateMonth = date.getMonth();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let currentDay = today.getDate();
    let dateDay = date.getDate();
    let dayDifference = currentDay - dateDay;
    const daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    const secondsDifference = currentSeconds - seconds;

    const isThisMonth = today.getMonth() === dateMonth;
    const isThisYear = today.getFullYear() === date.getFullYear();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    //Return day and year updated if date not in current year
    if (isThisYear) {
      if (!isThisMonth) {
        return `Updated on ${date.getDate()} ${monthNames[dateMonth]}`;
      }

      if (currentDay < daysInCurrentMonth && dayDifference > 0) {
        return `Updated ${dayDifference} ${
          dayDifference > 1 ? 'days' : 'day'
        } ago`;
      }

      switch (true) {
        case Math.floor(timeDifference / month) > 1:
          return `Updated ${Math.floor(timeDifference / month)} minutes ago`;

        case Math.floor(timeDifference / minute) > 1:
          if (Math.floor(timeDifference / minute) > 60) {
            return `Updated ${Math.floor(
              timeDifference / minute / 60,
            )} hours ago`;
          }

          return `Updated ${Math.floor(timeDifference / minute)} minutes ago`;

        default:
          return `Updated ${secondsDifference} seconds ago`;
      }
    } else {
      return `Updated on ${date.getDate()} ${
        monthNames[dateMonth]
      } ${date.getFullYear()}`;
    }
  }

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
})();
