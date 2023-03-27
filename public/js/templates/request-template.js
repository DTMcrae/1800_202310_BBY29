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
  docID,
  ...data
}) => {
  let box = document.createElement("div");
  box.setAttribute('class', "card-wrapper");

  box.innerHTML = `
  <a href="/html/request-details.html?docID=${requestId || docID}" class="card request request-long requestPlaceholder">
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
            <svg height="18" width="18">
              <circle cx="9" cy="9" r="8" fill="#CCC" />
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