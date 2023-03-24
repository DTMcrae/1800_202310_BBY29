import { REQUEST_TYPE } from "../app/request.js";

export const createRequestTemplate = ({
  category,
  detail,
  images,
  location,
  title,
  urgency,
  type,
  requestId,
  ...data
}) => {
  let box = document.createElement("div");
  box.setAttribute('class', "card-wrapper");

  box.innerHTML = `
  <a href="/html/request-details.html?docID=${requestId}" class="card request request-long requestPlaceholder mb-3 mt-3">
    <div class="card-container">
      <div class="img">
        <img src="${images?.[0]}" class="img-thumbnail request-image" alt="${title || 'NAN'}">
        <div class="card-type-icon">
          <span class="material-symbols-outlined">
            ${type == REQUEST_TYPE.HELP ? 'volunteer_activism' : 'front_hand'}
          </span>
        </div>
      </div>
      <div class="container-text">
        <div class="card-body">
          <h5 class="card-title request-title">${title || 'NAN'}</h5>
          <p class="card-text request-details">${detail?.split(0,20) || 'NAN'}</p>
          <p class="card-text request-location"><small class="text-muted">${location || 'NAN'}</small></p>
          <p class="card-text request-category"><small class="text-muted">${category}</small></p>
          <ul class="request-bottom d-flex justify-content-end list-unstyled mt-auto">
            <li class="d-flex align-items-center me-3">
                <span class="material-symbols-outlined">crisis_alert</span>
              <small class="request-urgency">${urgency}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a>
  `;
  return box;
}