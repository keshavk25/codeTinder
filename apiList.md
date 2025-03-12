# DevCircle APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH / profile/edit/password

## connectionRequestRouter
- POST /request/send/interested/:userid
- POST /request/send/ignored/:userid
- POST /request/review/accepted/:requestid
- POST /request/review/rejected/:requestid

## userRouter
- GET /user/connections
- GET /user/feed

status : accepted, requested, interested, ignored