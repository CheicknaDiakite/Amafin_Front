import ScrollTop from "./components/ScrollTop";
import ThemeCustomization from "./themes";
import AppRouter from "./routes/AppRouter";


export default function App() {
  
  return (<>
    <ThemeCustomization>
      <ScrollTop>
        
        <AppRouter />
      </ScrollTop>
    </ThemeCustomization>
  </>
  )
}
