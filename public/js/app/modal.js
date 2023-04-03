const createSuccessModal = (message) => {
  let box = document.createElement("div");
  box.setAttribute('id', "success-modal-wrapper");

  box.innerHTML = `
    <div
      id="success-modal"
      class="modal fade"
      role="dialog"
      aria-labelledby="success-modal"
      aria-hidden="false"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="img">
            <img src="/img/complete.png" />
          </div>
          <p class="msg">${message || 'Complete'}</p>
        </div>
      </div>
    </div>
    `;
    
  document.body.appendChild(box);
}

export const showSuccessModal = ({
  message = "Complete",
  onShow = () => {},
  onClose = () => {},
} = {}) => {
  //initialize modal
  // console.log(message)
  createSuccessModal(message);
  $('#success-modal').modal('toggle');

  // onShow event
  $('#success-modal').on('shown.bs.modal', function (e) {
    // custom onShow function
    onShow?.();
  })

  // onClose event
  $('#success-modal').on('hide.bs.modal', function (e) {
    //remove modal dom if the action is finished
    $('#success-modal-wrapper').remove();

    // custom onClose function
    onClose?.();
  })
}
