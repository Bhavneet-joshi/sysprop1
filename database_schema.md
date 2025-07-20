erDiagram
    USERS ||--o{ CONTRACTS : "manages"
    USERS ||--o{ COMMENTS : "writes"
    USERS ||--|{ ROLES : "has"
    ROLES ||--o{ PERMISSIONS : "has"
    CONTRACTS ||--o{ COMMENTS : "has"
    USERS ||--o{ USER_ACTIVITY_LOGS : "generates"
    USERS ||--o{ OTPS : "requests"
    USERS ||--o{ SESSIONS : "has"

    USERS {
        id uuid PK
        name varchar(255)
        email varchar(255) UK
        mobile_number varchar(20) UK
        password_hash varchar(255)
        role_id uuid FK
        profile_photo_url varchar(255)
        address text
        pan_number varchar(10)
        aadhaar_number varchar(12)
        is_active boolean
        created_at timestamp
        updated_at timestamp
    }

    ROLES {
        id uuid PK
        name varchar(50) UK
        description text
    }

    PERMISSIONS {
        id uuid PK
        name varchar(50) UK
        description text
    }

    ROLE_PERMISSIONS {
        role_id uuid PK,FK
        permission_id uuid PK,FK
    }

    CONTRACTS {
        id uuid PK
        title varchar(255)
        description text
        value decimal(15,2)
        status varchar(50)
        start_date date
        end_date date
        client_id uuid FK
        created_by uuid FK
        created_at timestamp
        updated_at timestamp
    }

    CONTRACT_ASSIGNEES {
        contract_id uuid PK,FK
        employee_id uuid PK,FK
    }

    COMMENTS {
        id uuid PK
        contract_id uuid FK
        user_id uuid FK
        parent_comment_id uuid FK
        comment_text text
        is_resolved boolean
        created_at timestamp
        updated_at timestamp
    }

    USER_ACTIVITY_LOGS {
        id uuid PK
        user_id uuid FK
        activity_type varchar(100)
        details jsonb
        ip_address varchar(45)
        device_info text
        created_at timestamp
    }

    OTPS {
        id uuid PK
        user_id uuid FK
        otp_code varchar(10)
        channel varchar(10)
        expires_at timestamp
        is_verified boolean
    }

    SESSIONS {
        id uuid PK
        user_id uuid FK
        token text
        expires_at timestamp
        ip_address varchar(45)
        user_agent text
        is_active boolean
    }