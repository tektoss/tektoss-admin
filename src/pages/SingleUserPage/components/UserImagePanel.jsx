import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';
import profile from '../../../assets/images/profile.jpg';

export default function UserImagePanel({ data }) {
  const [show, setShow] = useState(false);
  const [unsuspendShow, setUnsuspendShow] = useState(false);

  const [status, setStatus] = useState((data?.status === 'suspended'));
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseUnsuspend = () => setUnsuspendShow(false);
  const handleShowUnsuspend = () => setUnsuspendShow(true);

  const handleUnsuspend = async () => {
    try {
      const messageObj = {
        message: 'Congratulations, your account has been re-activated.',
        heading: 'Account Activation',
        modifiedAt: Date.now(),
      };

      const vendorRef = doc(db, 'vendors', data.userId);

      await updateDoc(vendorRef, {
        status: 'active',
      });

      await updateDoc(vendorRef, {
        notifications: arrayUnion(messageObj),
      });

      setStatus(!status);
    } catch (err) {
      console.log(err.message);
    }

    handleCloseUnsuspend();
  };

  const handleSuspend = async () => {
    try {
      const messageObj = {
        message: 'After going through some reports and complaints on your account, it as been decided to suspend your account for an indefinite number of days. You will be notified once your account is reactivated',
        heading: 'Account Suspension',
        modifiedAt: Date.now(),
      };

      const vendorRef = doc(db, 'vendors', data.userId);
      await updateDoc(vendorRef, {
        status: 'suspended',
      });

      await updateDoc(vendorRef, {
        notifications: arrayUnion(messageObj),
      });

      setStatus(!status);
    } catch (err) {
      console.log(err.message);
    }

    handleClose();
  };

  return (
    <>
      <div className="user-profile__image-panel">
        <div className="user-profile__image-div" alt="user">
          <img src={data.image || profile} alt={data.displayName} />
        </div>
        <h4>{ data?.displayName }</h4>
        <div className="user-profile__image-panel__info-div">
          <div className="user-profile__image-panel__info-item">
            <h6>Followers</h6>
            <h4>{data?.followers}</h4>
          </div>
          <div className="user-profile__image-panel__info-item">
            <h6>Rating</h6>
            <h4>{ data?.rating }</h4>
          </div>
          <div className="user-profile__image-panel__info-item">
            <h6>Posts</h6>
            <h4>{ data?.posts ? data?.posts : 'N/A' }</h4>
          </div>
        </div>
        { status
        && (
        <button
          onClick={handleShowUnsuspend}
          className="user-profile__unsuspend-button m-1"
          type="button"
        >
          Unsuspend User
        </button>
        )}
        { !status
        && (
        <button
          onClick={handleShow}
          className="user-profile__suspend-button m-1"
          type="button"
        >
          Suspend User
        </button>
        )}
      </div>

      <Modal show={unsuspendShow} onHide={handleCloseUnsuspend} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>{`Reactivate user ${data?.displayName}`}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you&apos;d want to re-activate this user?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="user-profile__modal__unsuspend-button" type="button" onClick={handleUnsuspend}>
            Yes, re-activate user
          </button>
          <button className="user-profile__modal__close-button" type="button" onClick={handleCloseUnsuspend}>
            No, close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>{`Suspend user ${data?.displayName}`}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you&apos;d want to suspend this user?</h5>
        </Modal.Body>
        <Modal.Footer>
          <button className="user-profile__modal__suspend-button" type="button" onClick={handleSuspend}>
            Yes, suspend user
          </button>
          <button className="user-profile__modal__close-button" type="button" onClick={handleClose}>
            No, close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
