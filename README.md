# 📚 Angular Bookstore Admin Portal

![Application Cover](https://github.com/user-attachments/assets/b79e9e08-f46e-4263-8e97-d7cd3a8cc53f)

This is a fully functional Angular-based admin portal for managing a bookstore. It features role-based access control, CRUD operations, and an interactive, user-friendly interface built with Angular Material.

## Local Deployment

- Clone the repository.
- Install all dependencies with the command below.
```
npm i
```
- Start the JSON server with the command below.
```
json-server --watch db.json
```
- Start the main application now with the following command.
```
npm start
```
- Open your browser and navigate to `localhost:4200` to access the application.

## User Credentials

### Super Admin

```
Username: Super
Password: super
```

### Admin

```
Username: Admin
Password: admin
```

### Super Admin

```
Username: Sales
Password: sales
```

## User Roles

- **Super Admins**
     - Can Create Users of all Roles (Super Admins, Admins, Sales)
     - Can Edit/Delete User details of lower hierarchy members i.e., Admins and Sales.
     - Can Add/Edit/Delete Books
     - Can Add/Edit/Delete Authors
- **Admins**
     - Can Create Users of Sales only
     - Can Edit/Delete User details of lower hierarchy members i.e., Sales.
     - Can Add/Edit/Delete Books
     - Can Add/Edit/Delete Authors
- **Sales**
     - Cannot Access or Create or Edit or Delete Users in the application
     - Can Add/Edit/Delete Books
     - Can Add/Edit/Delete Authors
