const createModal = () => {
  let box = document.createElement("div");
  box.setAttribute('id', "modal-wrapper");

  box.innerHTML = `
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    `;

  document.body.appendChild(box);
}

export const showModal = () => {
  // createModal();
  // $('#modal-wrapper > div').modal('toggle')
}

const createSuccessModal = (message) => {
  let box = document.createElement("div");
  box.setAttribute('id', "success-modal-wrapper");

  box.innerHTML = `
    <div class="modal fade" id="success-modal" role="dialog" aria-labelledby="success-modal" aria-hidden="false">
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
  console.log(message)
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
