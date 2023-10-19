// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Payment {
    mapping(bytes32 => PaymentRequest) public invoices;

    mapping(string => mapping(string => uint256)) public cids;

    struct PaymentRequest {
        address requester;
        uint256 amount;
        bool paid;
    }

    event PaymentRequestCreated(
        bytes32 invoiceId,
        address requester,
        uint256 amount
    );
    event PaymentReceived(bytes32 invoiceId, address payer, uint256 amount);

    function makePaymentRequest(
        uint256 amount,
        string memory chatId,
        string memory cid
    ) external returns (bytes32) {
        bytes32 invoiceId = keccak256(abi.encode(chatId, cid, msg.sender));
        PaymentRequest storage request = invoices[invoiceId];
        require(request.amount == 0, "Invoice number already in use");
        request.requester = msg.sender;
        request.amount = amount;
        request.paid = false;

        emit PaymentRequestCreated(invoiceId, msg.sender, amount);
        return invoiceId;
    }

    function payInvoice(bytes32 invoiceId) external payable {
        PaymentRequest storage request = invoices[invoiceId];
        require(request.requester != address(0), "Invoice does not exist");
        require(!request.paid, "Invoice has already been paid");
        require(msg.value == request.amount, "Incorrect payment amount");

        address payable requester = payable(request.requester);
        requester.transfer(msg.value);

        request.paid = true;

        emit PaymentReceived(invoiceId, msg.sender, msg.value);
    }

    function payDirect(
        address to,
        string memory chatId,
        string memory cid
    ) external payable {
        bytes32 invoiceId = keccak256(abi.encode(chatId, cid, msg.sender));
        PaymentRequest storage request = invoices[invoiceId];
        require(to != address(0), "Invoice does not exist");
        require(!request.paid, "Invoice has already been paid");

        address payable requester = payable(to);
        requester.transfer(msg.value);

        request.amount = msg.value;
        request.requester = requester;
        request.paid = true;

        emit PaymentReceived(invoiceId, msg.sender, msg.value);
    }
}
