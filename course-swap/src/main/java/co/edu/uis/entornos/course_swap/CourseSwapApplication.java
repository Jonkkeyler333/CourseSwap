package co.edu.uis.entornos.course_swap;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CourseSwapApplication {

	public static void main(String[] args) {

		SpringApplication.run(CourseSwapApplication.class, args);
//		System.out.println(new BCryptPasswordEncoder().encode("Prueba123"));
	}

}
