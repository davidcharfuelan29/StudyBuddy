from sqlalchemy import text
from .database import SessionLocal, engine


def run_migration():
    print("Migrando created_at de String a DateTime...")
    with engine.connect() as conn:
        conn.execute(
            text("""
                ALTER TABLE sessions
                ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE
                USING
                    CASE
                        WHEN created_at IS NULL OR created_at = '' THEN NOW()
                        ELSE created_at::timestamp with time zone
                    END
            """)
        )

        conn.execute(
            text("""
                ALTER TABLE sessions
                ALTER COLUMN created_at SET DEFAULT NOW()
            """)
        )

        conn.execute(
            text("""
                ALTER TABLE sessions
                ALTER COLUMN created_at SET NOT NULL
            """)
        )

        conn.commit()
        print("Migración completada exitosamente.")


if __name__ == "__main__":
    run_migration()
