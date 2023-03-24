import { REQUEST_TYPE } from "../app/request.js";

export const createRequestTemplate = ({
  category,
  detail,
  images,
  location,
  title,
  urgency,
  requestType,
  requestId,
  ...data
}) => {
  let box = document.createElement("div");
  box.setAttribute('class', "card-wrapper");

  box.innerHTML = `
  <a href="/html/request-details.html?docID=${requestId}" class="card request request-long requestPlaceholder">
    <div class="card-container">
      <div class="img">
        <img src="${images?.[0]}" class="img-thumbnail request-image" alt="${title || 'NAN'}">
        <div class="card-type-icon">
          <span class="material-symbols-outlined">
            ${requestType == REQUEST_TYPE.HELP ? 'front_hand' : 'volunteer_activism'}
          </span>
        </div>
      </div>
      <div class="container-text">
        <div class="card-body">
          <h5 class="card-title request-title">${title || 'NAN'}</h5>
          <p class="card-text request-details">${detail?.split(0,20) || 'NAN'}</p>
          <p class="card-text request-location ellipsis-1">Location: ${location || 'NAN'}</p>
          <p class="card-text request-category">Cateogry: ${category}</p>
          <p class="card-text request-urgency request-urgency-${urgency?.toLowerCase()}">
            Urgency: 
            <svg height="20" width="20" class="request-urgency-svg">
              <circle cx="10" cy="10" r="10" fill="#EEE" />
            </svg>
            <span class="request-urgency-text">${urgency}</span>
          </p>
        </div>
      </div>
    </div>
  </a>
  `;
  return box;
}