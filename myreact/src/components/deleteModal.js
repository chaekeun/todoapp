import React from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function DeleteModal({ msg, onClickCancle, onClickConfirm }) {
  return (
    <div>
      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Title id="contained-modal-title-vcenter">
          Hello, this is a DeleteModal!
        </Modal.Title>

        <Modal.Body>
          <h4>Centered Modal</h4>
          <div>
            {msg.split("\n").map((text, idx) => (
              <div key={idx}>Delete {text}?</div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClickCancle}>Close Modal</Button>
          <Button onClick={onClickConfirm}>Delete Task</Button>
        </Modal.Footer>
      </Modal>
    </div>
    // <div>
    //   <h2>Hello, this is a DeleteModal!</h2>
    //   <div>
    //     {msg.split("\n").map((text, idx) => (
    //       <div key={idx}>Delete {text}?</div>
    //     ))}
    //   </div>
    //   <button onClick={onClickCancle}>Close Modal</button>
    //   <button onClick={onClickConfirm}>Delete Task</button>
    // </div>
  );
}

export default DeleteModal;
